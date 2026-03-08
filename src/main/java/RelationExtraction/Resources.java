/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package RelationExtraction;

import java.io.FileWriter;
import java.io.IOException;
import java.util.Map;

/**
 *
 * @author micha
 */
public class Resources {
     public static String promptPropertiesOnly="You are given the list of CIDOC-CRM properties:"
             + "P100_was_death_of\\n" +
"P101_had_as_general_use\\n" +
"P102_has_title\\n" +
"P103_was_intended_for\\n" +
"P104_is_subject_to\\n" +
"P105_right_held_by\\n" +
"P106_is_composed_of\\n" +
"P107_has_current_or_former_member\\n" +
"P109_has_current_or_former_curator\\n" +
"P10_falls_within\\n" +
"P110_augmented\\n" +
"P111_added\\n" +
"P112_diminished\\n" +
"P113_removed\\n" +
"P11_had_participant\\n" +
"P121_overlaps_with\\n" +
"P122_borders_with\\n" +
"P123_resulted_in\\n" +
"P124_transformed\\n" +
"P125_used_object_of_type\\n" +
"P126_employed\\n" +
"P127_has_broader_term\\n" +
"P128_carries\\n" +
"P12_occurred_in_the_presence_of\\n" +
"P130_shows_features_of\\n" +
"P132_spatiotemporally_overlaps_with\\n" +
"P133_is_spatiotemporally_separated_from\\n" +
"P134_continued\\n" +
"P135_created_type\\n" +
"P136_was_based_on\\n" +
"P137_exemplifies\\n" +
"P138_represents\\n" +
"P139_has_alternative_form\\n" +
"P140_assigned_attribute_to\\n" +
"P141_assigned\\n" +
"P142_used_constituent\\n" +
"P143_joined\\n" +
"P144_joined_with\\n" +
"P145_separated\\n" +
"P146_separated_from\\n" +
"P147_curated\\n" +
"P148_has_component\\n" +
"P14_carried_out_by\\n" +
"P150_defines_typical_parts_of\\n" +
"P151_was_formed_from\\n" +
"P152_has_parent\\n" +
"P156_occupies\\n" +
"P157_is_at_rest_relative_to\\n" +
"P15_was_influenced_by\\n" +
"P160_has_temporal_projection\\n" +
"P161_has_spatial_projection\\n" +
"P164_is_temporally_specified_by\\n" +
"P165_incorporates\\n" +
"P166_was_a_presence_of\\n" +
"P167_was_within\\n" +
"P168_place_is_defined_by\\n" +
"P16_used_specific_object\\n" +
"P171_at_some_place_within\\n" +
"P172_contains\\n" +
"P173_starts_before_or_with_the_end_of\\n" +
"P174_starts_before_the_end_of\\n" +
"P175_starts_before_or_with_the_start_of\\n" +
"P176_starts_before_the_start_of\\n" +
"P177_assigned_property_of_type\\n" +
"P179_had_sales_price\\n" +
"P17_was_motivated_by\\n" +
"P180_has_currency\\n" +
"P182_ends_before_or_with_the_start_of\\n" +
"P183_ends_before_the_start_of\\n" +
"P184_ends_before_or_with_the_end_of\\n" +
"P185_ends_before_the_end_of\\n" +
"P186_produced_thing_of_product_type\\n" +
"P187_has_production_plan\\n" +
"P188_requires_production_tool\\n" +
"P189_approximates\\n" +
"P190_has_symbolic_content\\n" +
"P191_had_duration\\n" +
"P195_was_a_presence_of\\n" +
"P196_defines\\n" +
"P197_covered_parts_of\\n" +
"P198_holds_or_supports\\n" +
"P19_was_intended_use_of\\n" +
"P20_had_specific_purpose\\n" +
"P21_had_general_purpose\\n" +
"P22_transferred_title_to\\n" +
"P23_transferred_title_from\\n" +
"P24_transferred_title_of\\n" +
"P25_moved\\n" +
"P26_moved_to\\n" +
"P27_moved_from\\n" +
"P28_custody_surrendered_by\\n" +
"P29_custody_received_by\\n" +
"P30_transferred_custody_of\\n" +
"P31_has_modified\\n" +
"P32_used_general_technique\\n" +
"P33_used_specific_technique\\n" +
"P34_concerned\\n" +
"P35_has_identified\\n" +
"P37_assigned\\n" +
"P38_deassigned\\n" +
"P39_measured\\n" +
"P3_has_note\\n" +
"P40_observed_dimension\\n" +
"P41_classified\\n" +
"P42_assigned\\n" +
"P43_has_dimension\\n" +
"P45_consists_of\\n" +
"P46_is_composed_of\\n" +
"P49_has_former_or_current_keeper\\n" +
"P50_has_current_keeper\\n" +
"P51_has_former_or_current_owner\\n" +
"P52_has_current_owner\\n" +
"P53_has_former_or_current_location\\n" +
"P54_has_current_permanent_location\\n" +
"P55_has_current_location\\n" +
"P56_bears_feature\\n" +
"P57_has_number_of_parts\\n" +
"P59_has_section\\n" +
"P5_consists_of\\n" +
"P62_depicts\\n" +
"P65_shows_visual_item\\n" +
"P68_foresees_use_of\\n" +
"P69_has_association_with\\n" +
"P71_lists\\n" +
"P72_has_language\\n" +
"P73_has_translation\\n" +
"P74_has_current_or_former_residence\\n" +
"P75_possesses\\n" +
"P76_has_contact_point\\n" +
"P79_beginning_is_qualified_by\\n" +
"P80_end_is_qualified_by\\n" +
"P81_ongoing_throughout\\n" +
"P81a_end_of_the_begin\\n" +
"P81b_begin_of_the_end\\n" +
"P82a_begin_of_the_begin\\n" +
"P82b_end_of_the_end\\n" +
"P86_falls_within\\n" +
"P8_took_place_on_or_within\\n" +
"P92_brought_into_existence\\n" +
"P93_took_out_of_existence\\n" +
"P94_has_created\\n" +
"P95_has_formed\\n" +
"P96_by_mother\\n" +
"P97_from_father\\n" +
"P98_brought_into_life\\n" +
"P99_dissolved\\n" +
"P89_falls_within\\n" +
"P7_took_place_at\\n" +
"P44_has_condition\\n" +
"P108_has_produced\\n" +
"P67_refers_to\\n" +
"P129_is_about\\n" +
"P1_is_identified_by\\n" +
"P48_has_preferred_identifier\\n" +
"P4_has_time-span\\n" +
"P2_has_type\\n" +
"P90a_has_lower_value_limit\\n" +
"P90b_has_upper_value_limit\\n" +
"P91_has_unit\\n" +
"P9_consists_of\\n" +
"P90_has_value\\n" +
"P82_at_some_time_within\\n" +
"P13_destroyed\\n" +
"P70_documents\\n" +
"";
    
    
    
    
    
    public static String promptClassesOnly="You are given the list of CIDOC-CRM classes:\\n" +
"E1_CRM_Entity\\n" +
"E2_Temporal_Entity\\n" +
"E3_Condition_State\\n" +
"E4_Period\\n" +
"E5_Event\\n" +
"E6_Destruction\\n" +
"E7_Activity\\n" +
"E8_Acquisition\\n" +
"E9_Move\\n" +
"E10_Transfer_of_Custody\\n" +
"E11_Modification\\n" +
"E12_Production\\n" +
"E13_Attribute_Assignment\\n" +
"E14_Condition_Assessment\\n" +
"E15_Identifier_Assignment\\n" +
"E16_Measurement\\n" +
"E17_Type_Assignment\\n" +
"E18_Physical_Thing\\n" +
"E19_Physical_Object\\n" +
"E20_Biological_Object\\n" +
"E21_Person\\n" +
"E22_Human-Made_Object\\n" +
"E24_Physical_Human-Made_Thing\\n" +
"E25_Human-Made_Feature\\n" +
"E26_Physical_Feature\\n" +
"E27_Site\\n" +
"E28_Conceptual_Object\\n" +
"E29_Design_or_Procedure\\n" +
"E30_Right\\n" +
"E31_Document\\n" +
"E32_Authority_Document\\n" +
"E33_E41_Linguistic_Appellation\\n" +
"E33_Linguistic_Object\\n" +
"E34_Inscription\\n" +
"E35_Title\\n" +
"E36_Visual_Item\\n" +
"E37_Mark\\n" +
"E39_Actor\\n" +
"E41_Appellation\\n" +
"E42_Identifier\\n" +
"E52_Time-Span\\n" +
"E53_Place\\n" +
"E54_Dimension\\n" +
"E55_Type\\n" +
"E56_Language\\n" +
"E57_Material\\n" +
"E58_Measurement_Unit\\n" +
"E63_Beginning_of_Existence\\n" +
"E64_End_of_Existence\\n" +
"E65_Creation\\n" +
"E66_Formation\\n" +
"E67_Birth\\n" +
"E68_Dissolution\\n" +
"E69_Death\\n" +
"E70_Thing\\n" +
"E71_Human-Made_Thing\\n" +
"E72_Legal_Object\\n" +
"E73_Information_Object\\n" +
"E74_Group\\n" +
"E77_Persistent_Item\\n" +
"E78_Curated_Holding\\n" +
"E79_Part_Addition\\n" +
"E80_Part_Removal\\n" +
"E81_Transformation\\n" +
"E83_Type_Creation\\n" +
"E85_Joining\\n" +
"E86_Leaving\\n" +
"E87_Curation_Activity\\n" +
"E89_Propositional_Object\\n" +
"E90_Symbolic_Object\\n" +
"E92_Spacetime_Volume\\n" +
"E93_Presence\\n" +
"E96_Purchase\\n" +
"E97_Monetary_Amount\\n" +
"E98_Currency\\n" +
"E99_Product_Type\\n";
    
    
    public static String prompt2 = "You are given CIDOC-CRM classes, their subclass and a description\\n" +
"" +
"E1_CRM_Entity subclassof: None \\n" +
"It comprises all things in the universe of discourse of the CIDOC Conceptual Reference Model. \\\n" +
"" +
"E2_Temporal_Entity subclassof: E1_CRM_Entity \\\n" +
"It comprises all phenomena, such as the instances of E4 Periods and E5 Events, which happen over a limited extent in time. \\\n" +
"" +
"E3_Condition_State subclassof: E2_Temporal_Entity \\\n" +
"It comprises the states of objects characterised by a certain condition over a time-span. \\\n" +
"" +
"E4_Period subclassof: E2_Temporal_Entity, E92_Spacetime_Volume \\\n" +
"It comprises sets of coherent phenomena or cultural manifestations occurring in time and space. \\\n" +
"" +
"E5_Event subclassof: E4_Period \\\n" +
"It comprises distinct, delimited and coherent processes and interactions of a material nature, in cultural, social or physical systems. \\\n" +
"" +
"E6_Destruction subclassof: E64_End_of_Existence \\\n" +
"It comprises events that destroy one or more instances of E18 Physical Thing, such that they lose their identity as the subjects of documentation. \\\n" +
"" +
"E7_Activity subclassof: E5_Event \\\n" +
"It comprises actions intentionally carried out by instances of E39 Actor that result in changes of state in the cultural, social, or physical systems documented. \\\n" +
"" +
"E8_Acquisition subclassof: E7_Activity \\\n" +
"It comprises transfers of legal ownership from one or more instances of E39 Actor to one or more other instances of E39 Actor. \\\n" +
"" +
"E9_Move subclassof: E7_Activity \\\n" +
"It comprises changes of the physical location of the instances of E19 Physical Object. \\\n" +
"" +
"E10_Transfer_of_Custody subclassof: E7_Activity \\\n" +
"It comprises transfers of the physical custody or the legal responsibility for the physical custody of objects. \\\n" +
"" +
"E11_Modification subclassof: E7_Activity \\\n" +
"It comprises instances of E7 Activity that are undertaken to create, alter or change instances of E24 Physical Human-Made Thing. \\\n" +
"" +
"" +
"E12_Production subclassof: E11_Modification, E63_Beginning_of_Existence \\\n" +
"It comprises activities that are designed to, and succeed in, creating one or more new items. \\\n" +
"" +
"E13_Attribute_Assignment subclassof: E7_Activity \\\n" +
"It comprises the actions of making assertions about one property of an object or any single relation between two items or concepts. \\\n" +
"" +
"E14_Condition_Assessment subclassof: E13_Attribute_Assignment \\\n" +
"It describes the act of assessing the state of preservation of an object during a particular period. \\\n" +
"" +
"E15_Identifier_Assignment subclassof: E13_Attribute_Assignment \\\n" +
"It comprises activities that result in the allocation of an identifier to an instance of E1 CRM Entity. \\\n" +
"" +
"E16_Measurement subclassof: E13_Attribute_Assignment \\\n" +
"It comprises actions measuring physical properties and other values that can be determined by a systematic, \\\n" +
"objective procedure of direct observation of particular states of physical reality. \\\n" +
"" +
"E17_Type_Assignment subclassof: E13_Attribute_Assignment \\\n" +
"It comprises the actions of classifying items of whatever kind. \\\n" +
"" +
"E18_Physical_Thing subclassof: E72_Legal_Object \\\n" +
"It comprises all persistent physical items with a relatively stable form, human-made or natural. \\\n" +
"" +
"" +
"E19_Physical_Object subclassof: E18_Physical_Thing \\\n" +
"It comprises items of a material nature that are units for documentation and have physical boundaries that separate them completely in an objective way from other objects. \\\n" +
"" +
"E20_Biological_Object subclassof: E19_Physical_Object \\\n" +
"It comprises individual items of a material nature, which live, have lived, or are natural products of or from living organisms. \\\n" +
"" +
"E21_Person subclassof: E20_Biological_Object, E39_Actor \\\n" +
"It comprises real persons who live or are assumed to have lived. \\\n" +
"" +
"E22_Human-Made_Object subclassof: E19_Physical_Object, E24_Physical_Human-Made_Thing \\\n" +
"It comprises all persistent physical objects of any size that are purposely created by human \\\n" +
"activity and have physical boundaries that separate them completely in an objective way from other objects. \\\n" +
"" +
"E24_Physical_Human-Made_Thing subclassof: E18_Physical_Thing, E71_Human-Made_Thing \\\n" +
"It comprises all persistent physical items of any size that are purposely created by human activity. \\\n" +
"" +
"E25_Human-Made_Feature subclassof: E24_Physical_Human-Made_Thing, E26_Physical_Feature \\\n" +
"It comprises physical features that are purposely created by human activity, such as scratches, artificial caves, artificial water channels, etc. \\\n" +
"" +
"E26_Physical_Feature subclassof: E18_Physical_Thing \\\n" +
"It comprises identifiable features that are physically attached in an integral way to particular physical objects. \\\n" +
"" +
"E27_Site subclassof: E26_Physical_Feature \\\n" +
"It comprises pieces of land or sea floor. \\\n" +
"" +
"E28_Conceptual_Object subclassof: E71_Human-Made_Thing \\\n" +
"It comprises non-material products of our minds and other human produced data \\\n" +
"that have become objects of a discourse about their identity, circumstances of creation, or historical implication. \\\n" +
"" +
"E29_Design_or_Procedure subclassof: E73_Information_Object \\\n" +
"It comprises documented plans for the execution of actions in order to achieve a result of a specific quality, form, or contents. \\\n" +
"" +
"E30_Right subclassof: E89_Propositional_Object \\\n" +
"It comprises legal privileges concerning material and immaterial things or their derivatives. \\\n" +
"" +
"E31_Document subclassof: E73_Information_Object \\\n" +
"It comprises identifiable immaterial items that make propositions about reality. \\\n" +
"These propositions may be expressed in text, graphics, images, audiograms, videograms, or by other similar means. \\\n" +
"" +
"E32_Authority_Document subclassof: E31_Document \\\n" +
"It comprises encyclopaedia, thesauri, authority lists and other documents that define terminology or conceptual systems for consistent use.. \\\n" +
"" +
"E33_Linguistic_Object subclassof: E73_Information_Object \\\n" +
"It comprises identifiable expressions in natural language or languages. \\\n" +
"" +
"E34_Inscription subclassof: E33_Linguistic_Object, E37_Mark \\\n" +
"It comprises recognisable texts that can be attached to instances of E24 Physical Human-Made Thing. \\\n" +
"" +
"E35_Title subclassof: E33_Linguistic_Object, E41_Appellation \\\n" +
"It comprises the textual strings that within a cultural context can be clearly identified as titles due to their form. \\\n" +
"" +
"E36_Visual_Item subclassof: E73_Information_Object \\\n" +
"It comprises the intellectual or conceptual aspects of recognisable marks and images. \\\n" +
"" +
"E37_Mark subclassof: E36_Visual_Item \\\n" +
"It comprises symbols, signs, signatures, or short texts applied to instances of E24 Physical Human-Made Thing by arbitrary techniques. \\\n" +
"" +
"E39_Actor subclassof: E77_Persistent_Item \\\n" +
"It comprises people, either individually or in groups, who have the potential to perform intentional actions of kinds for which they can be held responsible. \\\n" +
"" +
"E41_Appellation subclassof: E90_Symbolic_Object \\\n" +
"It comprises all signs, either meaningful or not, or arrangements of signs following a specific syntax. \\\n" +
"" +
"E42_Identifier subclassof: E41_Appellation \\\n" +
"It comprises strings or codes assigned to instances of E1 CRM Entity in order to identify them uniquely and permanently within the context of one or more organisations. \\\n" +
"" +
"E52_Time-Span subclassof: E1_CRM_Entity \\\n" +
"It comprises abstract temporal extents, in the sense of Galilean physics, having a beginning, an end, and a duration. \\\n" +
"" +
"E53_Place subclassof: E1_CRM_Entity \\\n" +
"It comprises extents in the natural space where people live, in particular on the surface of the Earth, in the pure sense of physics: independent from temporal phenomena and matter. \\\n" +
"" +
"E54_Dimension subclassof: E1_CRM_Entity \\\n" +
"It comprises quantifiable properties that can be measured by some calibrated means and can be approximated by values. \\\n" +
"" +
"E55_Type subclassof: E28_Conceptual_Object \\\n" +
"It comprises concepts denoted by terms from thesauri and controlled vocabularies used to characterize and classify instances of CIDOC CRM classes. \\\n" +
"" +
"E56_Language subclassof: E55_Type \\\n" +
"It is a specialization of E55 Type and comprises the natural languages in the sense of concepts. \\\n" +
"" +
"E57_Material subclassof: E55_Type \\\n" +
"It is a specialization of E55 Type and comprises the concepts of materials. \\\n" +
"" +
"E58_Measurement_Unit subclassof: E55_Type \\\n" +
"It is a specialization of E55 Type and comprises the types of measurement units: feet, inches, centimetres, litres, lumens, etc. \\\n" +
"" +
"E59_Primitive_Value subclassof: E1_CRM_Entity \\\n" +
"It comprises values of primitive data types of programming languages or database management systems. \\\n" +
"" +
"E60_Number subclassof: E59_Primitive_Value \\\n" +
"It comprises any encoding of computable (algebraic) values such as integers, real numbers, complex numbers, vectors, tensors, etc., including intervals of these values to express limited precision. \\\n" +
"" +
"E61_Time_Primitive subclassof: E41_Appellation, E59_Primitive_Value \\\n" +
"It comprises instances of E59 Primitive Value for time that should be implemented with appropriate validation, precision, and references to temporal coordinate systems. \\\n" +
"" +
"E62_String subclassof: E59_Primitive_Value \\\n" +
"It comprises coherent sequences of binary-encoded symbols. \\\n" +
"" +
"E63_Beginning_of_Existence subclassof: E5_Event \\\n" +
"It comprises events that bring into existence any instance of E77 Persistent Item. \\\n" +
"" +
"E64_End_of_Existence subclassof: E5_Event \\\n" +
"It comprises events that end the existence of any instance of E77 Persistent Item. \\\n" +
"" +
"E65_Creation subclassof: E7_Activity, E63_Beginning_of_Existence \\\n" +
"It comprises events that result in the creation of conceptual items or immaterial products, such as legends, poems, texts, music, images, movies, laws, types, etc. \\\n" +
"" +
"E66_Formation subclassof: E7_Activity, E63_Beginning_of_Existence \\\n" +
"It comprises events that result in the formation of a formal or informal E74 Group of people, such as a club, society, association, corporation, or nation. \\\n" +
"" +
"E67_Birth subclassof: E63_Beginning_of_Existence \\\n" +
"It comprises the births of human beings. \\\n" +
"" +
"E68_Dissolution subclassof: E64_End_of_Existence \\\n" +
"It comprises the events that result in the formal or informal termination of an instance of E74 Group. \\\n" +
"" +
"E69_Death subclassof: E64_End_of_Existence \\\n" +
"It comprises the deaths of human beings. \\\n" +
"" +
"E70_Thing subclassof: E77_Persistent_Item \\\n" +
"This general class comprises discrete, identifiable, instances of E77 Persistent Item that are documented as single units. \\\n" +
"" +
"E71_Human-Made_Thing subclassof: E70_Thing \\\n" +
"It comprises discrete, identifiable human-made items that are documented as single units. \\\n" +
"" +
"E72_Legal_Object subclassof: E70_Thing \\\n" +
"It comprises those material or immaterial items to which instances of E30 Right, such as the right of ownership or use, can be applied. \\\n" +
"" +
"E73_Information_Object subclassof: E89_Propositional_Object, E90_Symbolic_Object \\\n" +
"It comprises identifiable immaterial items, such as poems, jokes, data sets, images, texts, multimedia objects, procedural prescriptions, computer program code, algorithm or mathematical formulae. \\\n" +
"" +
"E74_Group subclassof: E39_Actor \\\n" +
"It comprises any gatherings or organizations of human individuals or groups that act collectively or in a similar way due to any form of unifying relationship. \\\n" +
"" +
"E77_Persistent_Item subclassof: E1_CRM_Entity \\\n" +
"It comprises items that have persistent characteristics of structural nature substantially related to their identity and their integrity. \\\n" +
"" +
"E78_Curated_Holding subclassof: E24_Physical_Human-Made_Thing \\\n" +
"It comprises aggregations of instances of E18 Physical Thing that are assembled and maintained by one or more instances of E39 Actor over time. \\\n" +
"" +
"E79_Part_Addition subclassof: E11_Modification \\\n" +
"It comprises activities that result in an instance of E18 Physical Thing being increased, enlarged, or augmented by the addition of a part. \\\n" +
"" +
"E80_Part_Removal subclassof: E11_Modification \\\n" +
"It comprises the activities that result in an instance of E18 Physical Thing being decreased by the removal of a part. \\\n" +
"" +
"E81_Transformation subclassof: E63_Beginning_of_Existence, E64_End_of_Existence \\\n" +
"It comprises the events that result in the simultaneous destruction of one or more than one E18 Physical Thing and the creation of one or more than one E18 Physical Thing. \\\n" +
"" +
"E83_Type_Creation subclassof: E65_Creation \\\n" +
"It comprises activities formally defining new types of items. \\\n" +
"" +
"E85_Joining subclassof: E7_Activity \\\n" +
"It comprises the activities that result in an instance of E39 Actor becoming a member of an instance of E74 Group. \\\n" +
"" +
"E86_Leaving subclassof: E7_Activity \\\n" +
"It comprises the activities that result in an instance of E39 Actor to be disassociated from an instance of E74 Group. \\\n" +
"" +
"E87_Curation_Activity subclassof: E7_Activity \\\n" +
"It comprises the activities that contribute to the management and the preservation and evolution of instances of E78 Curated Holding, following an implicit or explicit curation plan. \\\n" +
"" +
"E89_Propositional_Object subclassof: E28_Conceptual_Object \\\n" +
"It comprises immaterial items, including but not limited to stories, plots, procedural prescriptions, algorithms, laws of physics or images. \\\n" +
"" +
"E90_Symbolic_Object subclassof: E28_Conceptual_Object, E72_Legal_Object \\\n" +
"It comprises identifiable symbols and any aggregation of symbols, such as characters, identifiers, traffic signs, emblems, texts, data sets, images. \\\n" +
"" +
"E92_Spacetime_Volume subclassof: E1_CRM_Entity \\\n" +
"It comprises 4-dimensional point sets (volumes) in physical spacetime (in contrast to mathematical models of it) regardless of their true geometric forms. \\\n" +
"" +
"E93_Presence subclassof: E92_Spacetime_Volume \\\n" +
"It comprises instances of E92 Spacetime Volume, whose temporal extent has been chosen in order to determine the spatial extent of a phenomenon over the chosen time-span. \\\n" +
"" +
"E94_Space_Primitive subclassof: E41_Appellation, E59_Primitive_Value \\\n" +
"It comprises instances of E59 Primitive Value for space that should be implemented with appropriate validation, precision and references to spatial coordinate systems. \\\n" +
". \\\n" +
"E95_Spacetime_Primitive subclassof: E41_Appellation, E59_Primitive_Value \\\n" +
"It comprises instances of E59 Primitive Value for spacetime volumes that should be implemented with appropriate validation, precision and reference systems. \\\n" +
"" +
"E96_Purchase subclassof: E8_Acquisition \\\n" +
"It comprises transfers of legal ownership from one or more instances of E39 Actor to one or more different instances of E39 Actor, where the transferring party is completely compensated by the payment of a monetary amount. \\\n" +
"" +
"E97_Monetary_Amount subclassof: E54_Dimension \\\n" +
"It comprises quantities of monetary possessions or obligations in terms of their nominal value with respect to a particular currency. \\\n" +
"" +
"E98_Currency subclassof: E58_Measurement_Unit \\\n" +
"It comprises the units in which a monetary system, supported by an administrative authority or other community, quantifies and arithmetically compares all monetary amounts declared in the unit. \\\n" +
"" +
"E99_Product_Type subclassof: E55_Type \\\n" +
"It comprises types that stand as the models for instances of E22 Human-Made Object that are produced as the result of production activities using plans exact enough to result in one or more series of uniform, \\\n" +
"functionally and aesthetically identical and interchangeable items.";
    
    
static String prompt3="You are given CIDOC-CRM classes, their subclassof and a description. Please first read it very carefully.\\n" +
"" +
"E1_CRM_Entity subclassof: None\\n" +
"Represents all things that fall within the scope of the CIDOC Conceptual Reference Model. \\n" +
"" +
"E2_Temporal_Entity subclassof: E1_CRM_Entity\\n" +
"Represents phenomena that occur over a limited duration of time. \\n" +
"" +
"E3_Condition_State subclassof: E2_Temporal_Entity\\n" +
"Represents the state or condition of an object during a specific time span. \\n" +
"" +
"E4_Period subclassof: E2_Temporal_Entity, E92_Spacetime_Volume\\n" +
"Represents coherent sets of phenomena or cultural manifestations in time and space. \\n" +
"" +
"E5_Event subclassof: E4_Period\\n" +
"Represents distinct material processes or interactions in cultural, social, or physical systems. \\n" +
"" +
"E6_Destruction subclassof: E64_End_of_Existence\\n" +
"Represents events that cause one or more physical things to lose their identity. \\n" +
"" +
"E7_Activity subclassof: E5_Event\\n" +
"Represents intentional actions carried out by actors that change states or conditions. \\n" +
"" +
"E8_Acquisition subclassof: E7_Activity\\n" +
"Represents the transfer of legal ownership between actors. \\n" +
"" +
"E9_Move subclassof: E7_Activity\\n" +
"Represents the relocation of physical objects. \\n" +
"" +
"E10_Transfer_of_Custody subclassof: E7_Activity\\n" +
"Represents the transfer of physical custody or responsibility for objects. \\n"
 +"E11_Modification subclassof: E7_Activity\\n" +
"Represents activities that alter, create, or change human made things. \\n" +
"" +
"E12_Production subclassof: E11_Modification, E63_Beginning_of_Existence\\n" +
"Represents activities that successfully create new items. \\n" +
"" +
"E13_Attribute_Assignment subclassof: E7_Activity\\n" +
"Represents actions that make assertions about properties or relations between items. \\n" +
"" +
"E14_Condition_Assessment subclassof: E13_Attribute_Assignment\\n" +
"Represents the evaluation of an object preservation state. \\n" +
"" +
"E15_Identifier_Assignment subclassof: E13_Attribute_Assignment\\n" +
"Represents activities assigning identifiers to CRM entities. \\n" +
"" +
"E16_Measurement subclassof: E13_Attribute_Assignment\\n" +
"Represents the measurement of physical properties using systematic methods. \\n" +
"" +
"E17_Type_Assignment subclassof: E13_Attribute_Assignment\\n" +
"Represents the classification of items into defined types. \\n" +
"" +
"E18_Physical_Thing subclassof: E72_Legal_Object\\n" +
"Represents persistent physical items, natural or human-made, with stable form. \\n" +
"" +
"E19_Physical_Object subclassof: E18_Physical_Thing\\n" +
"Represents discrete material objects with definite physical boundaries. \\n" +
"" +
"E20_Biological_Object subclassof: E19_Physical_Object\\n" +
"Represents physical objects that are or were living organisms or their products. \\n" +
"" +
"E21_Person subclassof: E20_Biological_Object, E39_Actor\\n" +
"Represents real human individuals, living or historical. \\n" +
"" +
"E22_Human-Made_Object subclassof: E19_Physical_Object, E24_Physical_Human-Made_Thing\\n" +
"Represents physical objects intentionally created by human activity. \\n" +
"" +
"E24_Physical_Human-Made_Thing subclassof: E18_Physical_Thing, E71_Human-Made_Thing\\n" +
"Represents all physical items intentionally created by humans. \\n" +
"" +
"E25_Human-Made_Feature subclassof: E24_Physical_Human-Made_Thing, E26_Physical_Feature\\n" +
"Represents features physically integrated into objects, created by human activity. \\n" +
"" +
"E26_Physical_Feature subclassof: E18_Physical_Thing\\n" +
"Represents identifiable physical features attached to objects. \\n" +
"" +
"E27_Site subclassof: E26_Physical_Feature\\n" +
"Represents defined portions of land or seafloor. \\n" +
"" +
"E28_Conceptual_Object subclassof: E71_Human-Made_Thing\\n" +
"Represents non-material intellectual or conceptual products of human creation. \\n" +
"" +
"E29_Design_or_Procedure subclassof: E73_Information_Object\\n" +
"Represents documented plans or procedures for achieving specific results. \\n" +
"" +
"E30_Right subclassof: E89_Propositional_Object\\n" +
"Represents legal privileges relating to tangible or intangible things. \\n"       
 +"E31_Document subclassof: E73_Information_Object\\n" +
"Represents identifiable immaterial items that express propositions about reality. \\n" +
"" +
"E32_Authority_Document subclassof: E31_Document\\n" +
"Represents reference works or terminological systems defining consistent vocabularies. \\n" +
"" +
"E33_Linguistic_Object subclassof: E73_Information_Object\\n" +
"Represents expressions in natural language. \\n" +
"" +
"E34_Inscription subclassof: E33_Linguistic_Object, E37_Mark\\n" +
"Represents recognizable texts physically attached to objects. \\n" +
"" +
"E35_Title subclassof: E33_Linguistic_Object, E41_Appellation\\n" +
"Represents textual strings that function as titles within a cultural context. \\n" +
"" +
"E36_Visual_Item subclassof: E73_Information_Object\\n" +
"Represents conceptual aspects of recognizable visual marks or images. \\n" +
"" +
"E37_Mark subclassof: E36_Visual_Item\\n" +
"Represents symbols or signs applied to objects, such as signatures or emblems. \\n" +
"" +
"E39_Actor subclassof: E77_Persistent_Item\\n" +
"Represents individuals or groups capable of intentional action. \\n" +
"" +
"E41_Appellation subclassof: E90_Symbolic_Object\\n" +
"Represents signs or symbol arrangements used to identify specific entities. \\n" +
"" +
"E42_Identifier subclassof: E41_Appellation\\n" +
"Represents codes or strings uniquely identifying CRM entities. \\n" +
"" +
"E52_Time-Span subclassof: E1_CRM_Entity\\n" +
"Represents abstract extents of time with a defined beginning and end. \\n" +
"" +
"E53_Place subclassof: E1_CRM_Entity\\n" +
"Represents extents in natural physical space, independent of matter or time. \\n" +
"" +
"E54_Dimension subclassof: E1_CRM_Entity\\n" +
"Represents measurable or quantifiable properties of things. \\n" +
"" +
"E55_Type subclassof: E28_Conceptual_Object\\n" +
"Represents controlled vocabulary concepts used to categorize entities. \\n" +
"" +
"E56_Language subclassof: E55_Type\\n" +
"Represents natural languages as conceptual types. \\n" +
"" +
"E57_Material subclassof: E55_Type\\n" +
"Represents conceptual definitions of materials. \\n" +
"" +
"E58_Measurement_Unit subclassof: E55_Type\\n" +
"Represents types of units used for measurement. \\n" +
"" +
"E59_Primitive_Value subclassof: E1_CRM_Entity\\n" +
"Represents basic data values used in documentation or computation. \\n" +
"" +
"E60_Number subclassof: E59_Primitive_Value\\n" +
"Represents numeric or algebraic values used for computation. \\n" +
"" +
"E61_Time_Primitive subclassof: E41_Appellation, E59_Primitive_Value\\n" +
"Represents primitive time values defined within specific coordinate systems. \\n" +
"" +
"E62_String subclassof: E59_Primitive_Value\\n" +
"Represents sequences of encoded symbols or text. \\n" +
"" +
"E63_Beginning_of_Existence subclassof: E5_Event\\n" +
"Represents events that bring persistent items into existence. \\n" +
"" +
"E64_End_of_Existence subclassof: E5_Event\\n" +
"Represents events marking the end of an item  existence. \\n" +
"" +
"E65_Creation subclassof: E7_Activity, E63_Beginning_of_Existence\\n" +
"Represents events that create new conceptual or immaterial products. \\n" +
"" +
"E66_Formation subclassof: E7_Activity, E63_Beginning_of_Existence\\n" +
"Represents events forming new formal or informal groups. \\n" +
"" +
"E67_Birth subclassof: E63_Beginning_of_Existence\\n" +
"Represents the birth of a human being. \\n" +
"" +
"E68_Dissolution subclassof: E64_End_of_Existence\\n" +
"Represents the termination of a group or collective. \\n" +
"" +
"E69_Death subclassof: E64_End_of_Existence\\n" +
"Represents the death of a human being. \\n" +
"" +
"E70_Thing subclassof: E77_Persistent_Item\\n" +
"Represents discrete identifiable units of persistent items. \\n" +
"" +
"E71_Human-Made_Thing subclassof: E70_Thing\\n" +
"Represents identifiable items created by humans. \\n" +
"" +
"E72_Legal_Object subclassof: E70_Thing\\n" +
"Represents things subject to legal rights or ownership. \\n" +
"" +
"E73_Information_Object subclassof: E89_Propositional_Object, E90_Symbolic_Object\\n" +
"Represents identifiable immaterial items such as texts, data, or code. \\n" +
"" +
"E74_Group subclassof: E39_Actor\\n" +
"Represents collectives or organizations acting together. \\n" +
"" +
"E77_Persistent_Item subclassof: E1_CRM_Entity\\n" +
"Represents items with enduring structural characteristics related to identity. \\n" +
"" +
"E78_Curated_Holding subclassof: E24_Physical_Human-Made_Thing\\n" +
"Represents maintained collections of physical things curated for a purpose. \\n" +
"" +
"E79_Part_Addition subclassof: E11_Modification\\n" +
"Represents activities that enlarge a physical thing by adding a part. \\n" +
"" +
"E80_Part_Removal subclassof: E11_Modification\\n" +
"Represents activities that decrease a physical thing by removing a part. \\n" +
"" +
"E81_Transformation subclassof: E63_Beginning_of_Existence, E64_End_of_Existence\\n" +
"Represents events causing destruction and simultaneous creation of physical things. \\n" +
"" +
"E83_Type_Creation subclassof: E65_Creation\\n" +
"Represents activities that formally define new types or categories. \\n" +
"" +
"E85_Joining subclassof: E7_Activity\\n" +
"Represents activities through which actors become members of a group. \\n" +
"" +
"E86_Leaving subclassof: E7_Activity\\n" +
"Represents activities through which actors leave a group. \\n" +
"" +
"E87_Curation_Activity subclassof: E7_Activity\\n" +
"Represents activities that manage and preserve curated holdings. \\n" +
"" +
"E89_Propositional_Object subclassof: E28_Conceptual_Object\\n" +
"Represents conceptual items that express sets of propositions about things. \\n" +
"" +
"E90_Symbolic_Object subclassof: E28_Conceptual_Object, E72_Legal_Object\\n" +
"Represents identifiable symbolic structures such as texts or signs. \\n" +
"" +
"E92_Spacetime_Volume subclassof: E1_CRM_Entity\\n" +
"Represents four-dimensional volumes in physical spacetime. \\n" +
"" +
"E93_Presence subclassof: E92_Spacetime_Volume\\n" +
"Represents spatial and temporal extents of phenomena over defined time spans. \\n" +
"" +
"E94_Space_Primitive subclassof: E41_Appellation, E59_Primitive_Value\\n" +
"Represents primitive spatial values defined within coordinate systems. \\n" +
"" +
"E95_Spacetime_Primitive subclassof: E41_Appellation, E59_Primitive_Value\\n" +
"Represents primitive spacetime values validated with reference systems. \\n" +
"" +
"E96_Purchase subclassof: E8_Acquisition\\n" +
"Represents ownership transfers compensated by monetary payment. \\n" +
"" +
"E97_Monetary_Amount subclassof: E54_Dimension\\n" +
"Represents quantified monetary values relative to specific currencies. \\n" +
"" +
"E98_Currency subclassof: E58_Measurement_Unit\\n" +
"Represents units used to quantify and compare monetary amounts. \\n" +
"" +
"E99_Product_Type subclassof: E55_Type\\n" +
 "Represents types modeling human-made objects produced to uniform designs.";

    public static String DisplayPrefixes(String ntText, String base, String prefix) {
        StringBuilder out = new StringBuilder();
        for (String line : ntText.split("\\R")) {
            String l = line.trim();
            if (l.isEmpty()) {
                continue;
            }
            if (!l.startsWith("<")) {
                out.append(l).append("\n");
                continue;
            }

            int sEnd = l.indexOf('>');
            if (sEnd < 0) {
                out.append(l).append("\n");
                continue;
            }
            String subj = l.substring(1, sEnd); // χωρίς <>

            if (subj.startsWith(base)) {
                String local = subj.substring(base.length());
                String rest = l.substring(sEnd + 1).trim();
                out.append(prefix).append(local).append(" ").append(rest).append("\n");
            } else {
                out.append(l).append("\n");
            }
        }
        return out.toString();
    }

    public static String displayPrefixesAll(String ntText, Map<String, String> nsToPrefix) {
        StringBuilder out = new StringBuilder();

        for (String line : ntText.split("\\R")) {
            String l = line.trim();
            if (l.isEmpty() || l.startsWith("#")) {
                out.append(l).append("\n");
                continue;
            }

            // Πιάσε "S P O ."
            // S,P μπορεί να είναι <...> ή prefixed; O μπορεί να είναι <...> ή "literal"...
            // Δεν αλλάζουμε literals.
            String[] parts = l.split("\\s+", 4);
            if (parts.length < 4 || !parts[3].equals(".")) {
                // πιο χαλαρό fallback: ξαναγράψε τη γραμμή
                out.append(l).append("\n");
                continue;
            }
            String s = parts[0];
            String p = parts[1];
            String o = parts[2];

            s = shortenIfIRI(s, nsToPrefix);
            p = shortenIfIRI(p, nsToPrefix);
            if (!o.startsWith("\"")) { // μην πειράξεις literals
                o = shortenIfIRI(o, nsToPrefix);
            }

            out.append(s).append(" ").append(p).append(" ").append(o).append(" .\n");
        }
        return out.toString();
    }

    private static String shortenIfIRI(String token, Map<String, String> nsToPrefix) {
        if (!(token.startsWith("<") && token.endsWith(">"))) {
            return token; // ήδη prefixed ή literal
        }
        String iri = token.substring(1, token.length() - 1);
        for (Map.Entry<String, String> e : nsToPrefix.entrySet()) {
            String base = e.getKey();
            String prefix = e.getValue(); // π.χ. "rdf:" / "crm:" / "forth:" / "rdfs:"
            if (iri.startsWith(base)) {
                String local = iri.substring(base.length());
                return prefix + local; // χωρίς γωνιαίες
            }
        }
        return token; // δεν ταίριαξε κανένα base
    }



    public static void writeToFile(String filePath, String content) {
        try (FileWriter writer = new FileWriter(filePath)) {
            writer.write(content);
            System.out.println("Successfully wrote to file: " + filePath);
        } catch (IOException e) {
            System.err.println("Error writing to file: " + e.getMessage());
        }
    }

}
